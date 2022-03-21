# Layers are ordered from the least likely to change to the mostlikely
# to change. By doing that, we reduce the number of layers to build and
# push to Artifactory as the non changing ones are reused.

#-----------------------------------------------------
# Use a golden image downloaded from the artifact repo
#-----------------------------------------------------
FROM docker.jfrog.kaloom.io/flowfabric/base-image:2.4.1

#-----------------------
# install redis and node.js
#-----------------------
RUN yum -y install redis wget xz git jq && \
    yum clean all

RUN mkdir -p /opt/nodejs
RUN mkdir -p /usr/local/lib/nodejs  
RUN wget https://nodejs.org/dist/v16.14.2/node-v16.14.2-linux-x64.tar.xz  -O /opt/nodejs/node-v16.14.2-linux-x64.tar.xz 
RUN tar -xvf  /opt/nodejs/node-v16.14.2-linux-x64.tar.xz -C /usr/local/lib/nodejs

ENV PATH "/usr/local/lib/nodejs/node-v16.14.2-linux-x64/bin:$PATH"
ENV VERSION v16.14.2
ENV DISTRO linux-x64

RUN node -v
#----------------------------------------
# prepare the devel container to be able
# to build the CP Runtime container
#----------------------------------------
RUN mkdir -p /opt/scrumblr
COPY entrypoint.sh /opt/scrumblr
CMD ["/opt/scrumblr/entrypoint.sh"]
COPY . /opt/scrumblr
# cd /opt &&  git clone https://github.com/aliasaria/scrumblr.git
RUN cd /opt/scrumblr && npm install


